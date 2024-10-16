import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, addUser, updateUser, deleteUser, selectAllUsers } from '../redux/slices/UserSlice';

const UsersComponent = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);
  const [newUser, setNewUser] = useState({ name: '', email: '' });

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleAddUser = () => {
    dispatch(addUser({ name: newUser.name, email: newUser.email }));
    setNewUser({ name: '', email: '' });
  };

  const handleUpdateUser = (id) => {
    const updatedName = prompt('Enter new name:');
    if (updatedName) {
      dispatch(updateUser({ id, name: updatedName }));
    }
  };

  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div style={{textAlign: 'center'}}>
      <h2>Users List</h2>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button onClick={handleAddUser}>Add User</button>

      <ul>
        {users.map((user) => (
          <li key={user.id} className='table_styling'>
           <span style={{marginLeft: '30px'}}>{user.name} </span> ({user.email})
            <button onClick={() => handleUpdateUser(user.id)}>Update</button>
            <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersComponent;
