import { AssignmentViewClient } from "./assignment-view-client";

interface AssignmentPageProps {
    params: Promise<{ token: string; locale: string }>;
}

export default async function AssignmentPage({ params }: AssignmentPageProps) {
    const { token } = await params;

    return <AssignmentViewClient token={token} />;
}
