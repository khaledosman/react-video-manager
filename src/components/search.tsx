import React, { memo, MouseEvent, ChangeEvent, useState } from 'react';
import { TextField, Button } from '@material-ui/core';

interface SearchProps {
  onClick: (searchValue: string) => void;
}

const searchStyles = { display: 'flex', marginTop: '20px' };

export const Search: React.FC<SearchProps> = memo(function Search(props) {
  const { onClick } = props;
  const [searchValue, setSearchValue] = useState('');

  const handleSearchValueChanged = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleClick = (e: MouseEvent) => {
    e.stopPropagation();
    onClick(searchValue);
  };

  return (
    <div style={searchStyles}>
      <TextField label="Search" variant="outlined" value={searchValue} onChange={handleSearchValueChanged} />
      <Button variant="contained" color="primary" onClick={handleClick}>
        Search
      </Button>
    </div>
  );
});
