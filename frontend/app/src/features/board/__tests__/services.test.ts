import {describe, expect, it, vi} from "vitest";
import {fetchBoards} from "../services";
import apiClient from "../../../services/apiClient";

vi.mock("../../../services/apiClient");

describe('fetchBoards', () => {
    it('should fetch boards data', async () => {
        const mockData = [{id: 1, name: 'Board 1'}, {id: 2, name: 'Board 2'}];
        (apiClient.get as vi.Mock).mockResolvedValue({data: mockData});

        const res = await fetchBoards();
        
        expect(apiClient.get).toHaveBeenCalledWith("boards/");
        expect(res).toEqual(mockData);
    });
});
