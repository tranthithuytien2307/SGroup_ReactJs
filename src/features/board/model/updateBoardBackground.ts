import { boardAPI } from "../../../entities/board/api/boardAPI";

export const uploadBoardBackground = async (boardId: number, file: File) => {
  if (!boardId || !file) return null;

  try {
    const res = await boardAPI.uploadBackgroundFile(boardId, file);
    return res.data.responseObject.cover_url;
  } catch (error) {
    console.error("Error uploading board background:", error);
    throw error;
  }
};

export const updateBoardTheme = async (boardId: number, colorCode: string) => {
  if (!boardId || !colorCode) return null;

  try {
    const res = await boardAPI.updateBackground(boardId, {
      theme: colorCode,
      cover_url: null,
    });
    return res.data.responseObject.theme;
  } catch (error) {
    console.error("Error updating board theme:", error);
    throw error;
  }
};
