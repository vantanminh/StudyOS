/**
 * Cloud Functions stubs for StudyOS.
 * AI, review scheduling, weekly summary, and R2 signing must run here —
 * never call AI providers directly from the frontend.
 */
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { z } from "zod";

const openRouterKey = defineSecret("OPENROUTER_API_KEY");

const weeklyPlanInput = z.object({
  uid: z.string(),
  weekStart: z.string(),
  targetHours: z.number().min(1).max(80),
});

export const generateWeeklyPlan = onCall(
  { secrets: [openRouterKey], region: "asia-southeast1" },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Cần đăng nhập.");
    }

    const parsed = weeklyPlanInput.safeParse(request.data);
    if (!parsed.success) {
      throw new HttpsError("invalid-argument", "Payload không hợp lệ.");
    }

    if (parsed.data.uid !== request.auth.uid) {
      throw new HttpsError("permission-denied", "uid không khớp.");
    }

    // Placeholder — wire OpenRouter/Gemini behind this boundary.
    return {
      preview: true,
      days: [],
      message:
        "AI planning sẵn sàng khi cấu hình secret OPENROUTER_API_KEY. Người dùng phải xác nhận trước khi ghi task.",
    };
  },
);

export const createR2UploadUrl = onCall(
  { region: "asia-southeast1" },
  async (request) => {
    if (!request.auth?.uid) {
      throw new HttpsError("unauthenticated", "Cần đăng nhập.");
    }
    const schema = z.object({
      fileName: z.string().min(1).max(200),
      contentType: z.string().min(1),
      folder: z.enum(["documents", "images", "audio"]).default("documents"),
    });
    const data = schema.parse(request.data);
    const key = `${request.auth.uid}/${data.folder}/${Date.now()}-${data.fileName}`;
    return {
      storageKey: key,
      provider: "r2",
      uploadUrl: null,
      note: "Cấu hình R2 secrets rồi trả signed PUT URL tại đây.",
    };
  },
);
