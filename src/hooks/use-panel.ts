import { useProfileMemberID } from "@/components/Conversation/UseProfileMemberId"

export const usePanel = () => {

    const [profileMemberId, setProfileMemberId] = useProfileMemberID();

    const onOpenProfile = (memberId: number) => {
        setProfileMemberId(memberId.toString());
    }

    const onClose = () => {
        setProfileMemberId(null);
    }

    return {
        profileMemberId,
        onOpenProfile,
        onClose
    }

}