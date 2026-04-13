import api from "../../../shared/lib/axiosInstance";
import type { CloneTemplateBody, Template } from "../model/templateType";

export const templateAPI = {
  getAll: () => {
    return api.get<{ responseObject: Template[] }>("/templateBoard");
  },

  cloneTemplate: (templateId: number, body: CloneTemplateBody) => {
    return api.post(`/templateBoard/${templateId}/clone`, body);
  },
};
