import { atom, useAtom } from "jotai";

const modalState = atom(false);

export const useCreateWorkspaceModal = () => {
    return useAtom(modalState);
}

const editModalState = atom(false);

export const useEditWorkspaceModal = () => {
    return useAtom(editModalState);
}

const createChannel = atom(false);

export const useCreateChannelModal = () => {
    return useAtom(createChannel);
}