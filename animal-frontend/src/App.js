import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const ItemTable = () => {
  const [animals, setAnimals] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    type: '',
    scarcity: ''
  });
  const [createFormVisible, setCreateFormVisible] = useState(false);

  const fetchAnimals = () => {
    axios.get('http://localhost:8000/get')
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

  const handleDelete = (animalId) => {
    axios.delete(`http://localhost:8000/delete/${animalId}`)
      .then(response => {
        console.log('Animal deleted successfully');
        // Fetch updated animal list after deletion
        fetchAnimals();
      })
      .catch(error => {
        console.error('Error deleting animal:', error);
      });
  };

  const handleModify = (animal) => {
    setFormData({
      id: animal.id,
      name: animal.name,
      type: animal.type,
      scarcity: animal.scarcity
    });
    setCreateFormVisible(true); // Show create form with pre-filled data for modification
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { id, name, type, scarcity } = formData;

    if (id) {
      // Update existing animal
      axios.put(`http://localhost:8000/update/${id}`, { name, type, scarcity })
        .then(response => {
          console.log('Animal updated successfully');
          // Reset form data and fetch updated list of animals
          setFormData({ id: null, name: '', type: '', scarcity: '' });
          fetchAnimals();
          setCreateFormVisible(false);
        })
        .catch(error => {
          console.error('Error updating animal:', error);
        });
    } else {
      // Create new animal
      axios.post('http://localhost:8000/insert', { name, type, scarcity })
        .then(response => {
          console.log('Animal created successfully');
          // Reset form data and fetch updated list of animals
          setFormData({ id: null, name: '', type: '', scarcity: '' });
          fetchAnimals();
          setCreateFormVisible(false);
        })
        .catch(error => {
          console.error('Error creating animal:', error);
        });
    }
  };

  return (
    <>
      <h1><em>ANIMAL CRUD</em></h1>
      <button onClick={() => setCreateFormVisible(true)}>Create New Animal</button>
      {createFormVisible && (
        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData.id || ''} />
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </label>
          <label>
            Type:
            <input type="text" name="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
          </label>
          <label>
            Scarcity:
            <input type="text" name="scarcity" value={formData.scarcity} onChange={(e) => setFormData({ ...formData, scarcity: e.target.value })} />
          </label>
          <button type="submit">{formData.id ? 'Update' : 'Create'}</button>
        </form>
      )}
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
