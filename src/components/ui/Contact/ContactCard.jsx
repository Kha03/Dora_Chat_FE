import React from 'react';
import ContactCardDropdown from './ContactCardDropdown';

export function ContactCard({ contact }) {
    function onViewInfo() {
        console.log('View info');
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
        <button className="w-full focus:outline-none border-none p-0" onClick={() => console.log('View group')}>

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
                </div>
                <button className="bg-white text-gray-400 hover:text-gray-600 border-none focus:outline-none flex-shrink-0">
                    <ContactCardDropdown onViewInfo={onViewInfo} onCategoryChange={onCategoryChange} onSetNickname={onSetNickname} onDelete={onDelete} />
                </button>
            </div>
        </button>
    );
}