/* eslint-disable react/prop-types */
import { GroupRequestItem } from '@/components/ui/Contact/GroupRequestItem';

export function GroupRequestList({ groupRequests }) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5">
            {groupRequests !== undefined && groupRequests.map((request, index) => (
                <GroupRequestItem
                    key={index}
                    request={request}
                />
            ))}
        </div>
    );
}