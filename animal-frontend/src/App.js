import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const baseURL = 'http://localhost:8000'; // Define base URL for API requests

const ItemTable = () => {
  const [animals, setAnimals] = useState([]);
  const [createFormVisible, setCreateFormVisible] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    type: '',
    scarcity: ''
  });
  const [updateFormData, setUpdateFormData] = useState({
    id: null,
    name: '',
    type: '',
    scarcity: ''
  });

  const fetchAnimals = () => {
    axios.get(`${baseURL}/get`)
      .then(response => {
        setAnimals(response.data);
      })
      .catch(error => {
        console.error('Error fetching animals:', error);
      });
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();

    axios.post(`${baseURL}/insert`, createFormData)
      .then(response => {
        console.log('Animal created successfully');
        setCreateFormData({ name: '', type: '', scarcity: '' });
        setCreateFormVisible(false);
        fetchAnimals();
      })
      .catch(error => {
        console.error('Error creating animal:', error);
      });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    const { id, name, type, scarcity } = updateFormData;

    axios.put(`${baseURL}/update/${id}`, { name, type, scarcity })
      .then(response => {
        console.log('Animal updated successfully');
        setUpdateFormData({ id: null, name: '', type: '', scarcity: '' });
        fetchAnimals();
      })
      .catch(error => {
        console.error('Error updating animal:', error);
      });
  };

  const handleDelete = (animalId) => {
    axios.delete(`${baseURL}/delete/${animalId}`)
      .then(response => {
        console.log('Animal deleted successfully');
        fetchAnimals();
      })
      .catch(error => {
        console.error('Error deleting animal:', error);
      });
  };

  const handleModify = (animal) => {
    setUpdateFormData({
      id: animal.id,
      name: animal.name,
      type: animal.type,
      scarcity: animal.scarcity
    });
    setCreateFormVisible(true); // Show update form with pre-filled data
  };

  return (
    <>
      <h1><em>ANIMAL CRUD</em></h1>
      <button onClick={() => { setCreateFormData({ name: '', type: '', scarcity: '' }); setCreateFormVisible(true); }}>Create New Animal</button>
      
      {/* Create Form */}
      {createFormVisible && (
        <>
        <br />
        <span><strong>CREATE</strong></span>
        <form onSubmit={handleCreate}>
          <label>
            Name:
            <input type="text" value={createFormData.name} onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })} />
          </label>
          <label>
            Type:
            <input type="text" value={createFormData.type} onChange={(e) => setCreateFormData({ ...createFormData, type: e.target.value })} />
          </label>
          <label>
            Scarcity:
            <input type="text" value={createFormData.scarcity} onChange={(e) => setCreateFormData({ ...createFormData, scarcity: e.target.value })} />
          </label>
          <button type="submit">Create</button>
        </form>
        </>
      )}
      <br />
      {/* Update Form */}
      {updateFormData.id && (
        <>
        <span><strong>MODIFY</strong></span>
        <form onSubmit={handleUpdate}>
          <input type="hidden" value={updateFormData.id} />
          <label>
            Name:
            <input type="text" value={updateFormData.name} onChange={(e) => setUpdateFormData({ ...updateFormData, name: e.target.value })} />
          </label>
          <label>
            Type:
            <input type="text" value={updateFormData.type} onChange={(e) => setUpdateFormData({ ...updateFormData, type: e.target.value })} />
          </label>
          <label>
            Scarcity:
            <input type="text" value={updateFormData.scarcity} onChange={(e) => setUpdateFormData({ ...updateFormData, scarcity: e.target.value })} />
          </label>
          <button type="submit">Update</button>
        </form>
        <br />
        </>
      )}

      {/* Animal Table */}
      <table>
        <thead>
          <tr>
            <th>Animal ID</th>
            <th>Animal Name</th>
            <th>Animal Type</th>
            <th>Endangerment Level</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {animals.map(animal => (
            <tr key={animal.id}>
              <td>{animal.id}</td>
              <td>{animal.name}</td>
              <td>{animal.type}</td>
              <td>{animal.scarcity}</td>
              <td>
                <button onClick={() => handleDelete(animal.id)}>Delete</button>
                <button onClick={() => handleModify(animal)}>Modify</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ItemTable;
