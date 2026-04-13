import { useState, useEffect } from "react";
import { templateAPI } from "../../../entities/template/api/templateAPI";
import type { Template } from "../../../entities/template/model/templateType";

export const useTemplates = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const res = await templateAPI.getAll();
        setTemplates(res.data.responseObject);
      } catch (err) {
        console.error("Failed to load templates:", err);
        setError("Failed to load templates");
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { templates, loading, error };
};
