import SearchBar from '../../components/SearchBar';
import Button from '../../components/Button';
import Navigation from '../../components/Navigation';
import { IoIosAdd } from "react-icons/io";

const Accounts = () => {
    return (
        <div className="p-8">
            <Navigation title="Accounts" />
            <div className='flex justify-between items-center'>
                <SearchBar />
                <Button icon={IoIosAdd} size='md' className='px-10'>Add</Button>
            </div>
        </div>
    );
};

export default Accounts;