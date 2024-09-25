import { useQueryState } from "nuqs";

export const useProfileMemberID = () => {
    return useQueryState("profileMemberId");
}