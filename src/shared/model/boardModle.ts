import { boardAPI } from "../api/boardAPI";

export const getBoardDetails = async (setBoard: any, id: number) => {
  const res = await boardAPI.getBoard(id);
  setBoard(res.data.responseObject);
}