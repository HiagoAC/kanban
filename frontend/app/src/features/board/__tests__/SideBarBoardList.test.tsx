// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from '@testing-library/react';
import { useFetchBoards } from '../hooks/useFetchBoards';
import { SideBarBoardList } from '../components/SideBarBoardList';
import { MemoryRouter } from "react-router-dom";

vi.mock("../hooks/useFetchBoards");

describe('SideBarBoardList', () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    it('displays boards when data is loaded', () => {
        const mockBoards = [
            { id: '1', title: 'Board 1' },
            { id: '2', title: 'Board 2' },
            { id: '3', title: 'Board 3' },
        ];

        vi.mocked(useFetchBoards).mockReturnValue({
            data: mockBoards,
            isLoading: false,
            isError: false,
        } as unknown as ReturnType<typeof useFetchBoards>);

        render(
            <MemoryRouter>
                <SideBarBoardList />
            </MemoryRouter>
        );

        expect(screen.getByText('Board 1')).not.toBeNull();
        expect(screen.getByText('Board 2')).not.toBeNull();
        expect(screen.getByText('Board 3')).not.toBeNull();
        expect(screen.queryByTestId('loading')).toBeNull();
        expect(screen.queryByTestId('error')).toBeNull();
    });

    it('displays loading div when isLoading is true', () => {
        vi.mocked(useFetchBoards).mockReturnValue({
            data: null,
            isLoading: true,
            isError: false,
        } as unknown as ReturnType<typeof useFetchBoards>);

        render(
            <MemoryRouter>
                <SideBarBoardList />
            </MemoryRouter>
        );

        expect(screen.getByTestId('loading')).not.toBeNull();
    });

    it('displays error div when isError is true', () => {
        vi.mocked(useFetchBoards).mockReturnValue({
            data: null,
            isLoading: false,
            isError: true,
        } as unknown as ReturnType<typeof useFetchBoards>);

        render(
            <MemoryRouter>
                <SideBarBoardList />
            </MemoryRouter>
        );

        expect(screen.getByTestId('error')).not.toBeNull();
    });
});

