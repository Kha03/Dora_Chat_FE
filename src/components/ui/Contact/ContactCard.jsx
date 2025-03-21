/* eslint-disable react/prop-types */
import ContactCardDropdown from '@/components/ui/Contact/ContactCardDropdown';

export function ContactCard({ contact }) {
    function onViewInfo() {
        console.log('View info');
        window.location.href = "/friend-information";
    }
    function onCategoryChange(category) {
        console.log('Change category to', category);
    }
    function onSetNickname() {
        console.log('Set nickname');
    }
    function onDelete() {
        console.log('Delete contact');
    }

    return (
        <div
            className="w-full focus:outline-none border-none p-0 cursor-pointer"
            onClick={() => console.log('View group')}
        >
            <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <img
                        src={contact.avatar}
                        alt={contact.name}
                        className="w-12 h-12 rounded-full flex-shrink-0 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{contact.name}</h3>
                        <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                    </div>
                    {contact.category && (
                        <div className={`w-2 h-2 rounded-full ${getCategoryColor(contact.category)}`} />
                    )}
                </div>
                <div className="flex-shrink-0">
                    <ContactCardDropdown
                        onViewInfo={onViewInfo}
                        onCategoryChange={onCategoryChange}
                        onSetNickname={onSetNickname}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </div>
    );
}

const getCategoryColor = (categoryId) => {
    const colorMap = {
        'customer': 'bg-red-500',
        'family': 'bg-pink-500',
        'work': 'bg-orange-500',
        'friends': 'bg-yellow-500',
        'reply-later': 'bg-green-500',
        'study': 'bg-blue-500'
    };
    return colorMap[categoryId] || 'bg-gray-500';
};