// import { listAPI } from "../../../entities/list/api/listAPI";

// export const moveList = async (
//   id: number,
//   newBoardId: number,
//   newIndex: number,
// ) => {
//   if (!id || !newBoardId || !newIndex) return;
//   try {
//     const response = await listAPI.moveList(id, newBoardId, newIndex);
//     return response.data;
//   } catch (error) {
//     console.log(`Error moving card ${id}: `, error);
//     throw error;
//   }
// };
