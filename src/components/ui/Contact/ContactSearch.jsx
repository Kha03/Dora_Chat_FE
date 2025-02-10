import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ContactSearch({ onSearch }) {

    return (
        <div className="relative w-full max-w-md mb-6">
            <div className='flex-1 relative flex items-center '>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-400 " />
                <Input
                    type="search"
                    placeholder="Search"
                    className="pl-10 w-[75%] bg-[#F5F5F5] placeholder-blue-400 [&::-webkit-search-cancel-button]:blue-400 bg-gray-50 text-regal-blue placeholder:text-regal-blue rounded-full border-regal-blue"
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div>

                <Button
                    className="bg-blue-400 rounded-full absolute right-2 top-1/2 -translate-y-1/2 hover:bg-blue-500"
                    variant="primary"
                    size="sm"
                >
                    <p className="text-white">Search</p>
                </Button>
            </div>

        </div>
    );
}