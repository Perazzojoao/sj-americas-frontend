import { Input } from "../ui/input";

type SerachInputProps = {
  handleSearchChange: (text: string) => void;
  placeHolder: string;
}

const SearchInput = ({ handleSearchChange, placeHolder }: SerachInputProps) => {
  return (
    <div className="w-full flex justify-center items-center gap-4 mb-8">
      <Input
        className="bg-card w-3/5 sm:w-3/6"
        placeholder={placeHolder}
        onChange={(e) => handleSearchChange(e.target.value)}
      />
    </div>

  );
}

export default SearchInput;