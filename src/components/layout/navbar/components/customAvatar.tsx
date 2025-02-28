import React from 'react';
import Avatar from '@mui/material/Avatar';

const stringToInitials = (name: string) => {
    const nameArray = name.trim().split(' ');
    // Only take the first two words, extract the first letter of each, and join them.
    const initials = nameArray.length > 1
      ? `${nameArray[0][0]}${nameArray[1][0]}`
      : nameArray[0][0]; // Fallback to the first initial if only one name is present.
    
    return initials.toUpperCase();
  };

const NameAvatar = ({ name }: { name: string }) => {
  const initials = stringToInitials(name);

  return (
    <Avatar sx={{ bgcolor: '#3f51b5', color: '#fff' }} className='w-6 h-8'>
      {initials}
    </Avatar>
  );
};

export default NameAvatar;
