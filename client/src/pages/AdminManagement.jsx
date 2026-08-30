import { useEffect, useState } from 'react';
import { Building2, DoorOpen, Tag, Plus, Pencil, Trash2 } from 'lucide-react';

import { useBuildingStore } from '../stores/buildingStore';
import { useRoomStore } from '../stores/roomStore';
import { useRoomTypeStore } from '../stores/roomTypeStore';

function Section({ title, icon: Icon, children }) {
  return (
    <section className='rounded-2xl border bg-white p-6 shadow-sm'>
      <div className='mb-5 flex items-center gap-3'>
        <div className='flex h-11 w-11 items-center justify-center rounded-xl bg-gray-900 text-white'>
          <Icon className='h-5 w-5' />
        </div>
        <h2 className='text-xl font-bold text-gray-900'>{title}</h2>
      </div>

      {children}
    </section>
  );
}

export default function AdminManagement() {
  const [activeTab, setActiveTab] = useState('buildings');

  // BUILDINGS
  const buildings = useBuildingStore((s) => s.buildings);
  const fetchBuildings = useBuildingStore((s) => s.fetchBuildings);
  const createBuilding = useBuildingStore((s) => s.createBuilding);
  const updateBuilding = useBuildingStore((s) => s.updateBuilding);
  const deleteBuilding = useBuildingStore((s) => s.deleteBuilding);

  // ROOMS
  const rooms = useRoomStore((s) => s.rooms);
  const fetchRooms = useRoomStore((s) => s.fetchRooms);
  const createRoom = useRoomStore((s) => s.createRoom);
  const updateRoom = useRoomStore((s) => s.updateRoom);
  const deleteRoom = useRoomStore((s) => s.deleteRoom);

  // ROOM TYPES
  const roomTypes = useRoomTypeStore((s) => s.roomTypes);
  const fetchRoomTypes = useRoomTypeStore((s) => s.fetchRoomTypes);
  const createRoomType = useRoomTypeStore((s) => s.createRoomType);
  const updateRoomType = useRoomTypeStore((s) => s.updateRoomType);
  const deleteRoomType = useRoomTypeStore((s) => s.deleteRoomType);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [buildingForm, setBuildingForm] = useState({
    name: '',
    address: '',
    description: '',
  });

  const [editingBuildingId, setEditingBuildingId] = useState(null);

  const [roomTypeForm, setRoomTypeForm] = useState({
    name: '',
    description: '',
  });

  const [editingRoomTypeId, setEditingRoomTypeId] = useState(null);

  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: '',
    buildingId: '',
    roomTypeId: '',
    workingHoursStart: '08:00',
    workingHoursEnd: '20:00',
  });

  const [editingRoomId, setEditingRoomId] = useState(null);

  useEffect(() => {
    Promise.all([
      fetchBuildings(),
      fetchRooms(),
      fetchRoomTypes(),
    ]).catch((err) => {
      setError(err.message);
    });
  }, [fetchBuildings, fetchRooms, fetchRoomTypes]);

  const showSuccess = (text) => {
    setError('');
    setMessage(text);
    setTimeout(() => setMessage(''), 3000);
  };

  // ---------------- BUILDINGS ----------------

  const resetBuildingForm = () => {
    setBuildingForm({
      name: '',
      address: '',
      description: '',
    });
    setEditingBuildingId(null);
  };

  const handleBuildingSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      if (editingBuildingId) {
        await updateBuilding(editingBuildingId, buildingForm);
        showSuccess('Building updated successfully.');
      } else {
        await createBuilding(buildingForm);
        showSuccess('Building created successfully.');
      }

      resetBuildingForm();
      await fetchBuildings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBuilding = (building) => {
    setBuildingForm({
      name: building.name || '',
      address: building.address || '',
      description: building.description || '',
    });

    setEditingBuildingId(building.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBuilding = async (id) => {
    if (!window.confirm('Are you sure you want to delete this building?')) {
      return;
    }

    try {
      await deleteBuilding(id);
      showSuccess('Building deleted successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------- ROOM TYPES ----------------

  const resetRoomTypeForm = () => {
    setRoomTypeForm({
      name: '',
      description: '',
    });
    setEditingRoomTypeId(null);
  };

  const handleRoomTypeSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      if (editingRoomTypeId) {
        await updateRoomType(editingRoomTypeId, roomTypeForm);
        showSuccess('Room type updated successfully.');
      } else {
        await createRoomType(roomTypeForm);
        showSuccess('Room type created successfully.');
      }

      resetRoomTypeForm();
      await fetchRoomTypes();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditRoomType = (roomType) => {
    setRoomTypeForm({
      name: roomType.name || '',
      description: roomType.description || '',
    });

    setEditingRoomTypeId(roomType.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRoomType = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room type?')) {
      return;
    }

    try {
      await deleteRoomType(id);
      showSuccess('Room type deleted successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  // ---------------- ROOMS ----------------

  const resetRoomForm = () => {
    setRoomForm({
      name: '',
      capacity: '',
      buildingId: '',
      roomTypeId: '',
      workingHoursStart: '08:00',
      workingHoursEnd: '20:00',
    });

    setEditingRoomId(null);
  };

  const toDateTime = (time) => {
    return `1970-01-01T${time}:00.000Z`;
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();

    try {
      setError('');

      const payload = {
        name: roomForm.name,
        capacity: Number(roomForm.capacity),
        buildingId: Number(roomForm.buildingId),
        roomTypeId: Number(roomForm.roomTypeId),
        workingHoursStart: toDateTime(roomForm.workingHoursStart),
        workingHoursEnd: toDateTime(roomForm.workingHoursEnd),
      };

      if (editingRoomId) {
        await updateRoom(editingRoomId, payload);
        showSuccess('Room updated successfully.');
      } else {
        await createRoom(payload);
        showSuccess('Room created successfully.');
      }

      resetRoomForm();
      await fetchRooms();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);

    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditRoom = (room) => {
    setRoomForm({
      name: room.name || '',
      capacity: room.capacity || '',
      buildingId: room.buildingId || '',
      roomTypeId: room.roomTypeId || '',
      workingHoursStart: formatTime(room.workingHoursStart),
      workingHoursEnd: formatTime(room.workingHoursEnd),
    });

    setEditingRoomId(room.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRoom = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) {
      return;
    }

    try {
      await deleteRoom(id);
      showSuccess('Room deleted successfully.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl border bg-white p-6 shadow-sm'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Administration
        </h1>

        <p className='mt-1 text-sm text-gray-600'>
          Manage buildings, room types and rooms.
        </p>

        <div className='mt-5 flex flex-wrap gap-2'>
          <button
            type='button'
            onClick={() => setActiveTab('buildings')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              activeTab === 'buildings'
                ? 'bg-gray-900 text-white'
                : 'border bg-white hover:bg-gray-50'
            }`}
          >
            Buildings
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('roomTypes')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              activeTab === 'roomTypes'
                ? 'bg-gray-900 text-white'
                : 'border bg-white hover:bg-gray-50'
            }`}
          >
            Room Types
          </button>

          <button
            type='button'
            onClick={() => setActiveTab('rooms')}
            className={`rounded-xl px-4 py-2 text-sm font-medium ${
              activeTab === 'rooms'
                ? 'bg-gray-900 text-white'
                : 'border bg-white hover:bg-gray-50'
            }`}
          >
            Rooms
          </button>
        </div>
      </div>

      {message && (
        <div className='rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700'>
          {message}
        </div>
      )}

      {error && (
        <div className='rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
          {error}
        </div>
      )}

      {activeTab === 'buildings' && (
        <Section title='Manage Buildings' icon={Building2}>
          <form
            onSubmit={handleBuildingSubmit}
            className='mb-8 grid gap-4 md:grid-cols-2'
          >
            <input
              required
              placeholder='Building name'
              value={buildingForm.name}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  name: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <input
              required
              placeholder='Address'
              value={buildingForm.address}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  address: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <textarea
              placeholder='Description'
              value={buildingForm.description}
              onChange={(e) =>
                setBuildingForm({
                  ...buildingForm,
                  description: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3 md:col-span-2'
            />

            <div className='flex gap-2 md:col-span-2'>
              <button
                type='submit'
                className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white'
              >
                <Plus className='h-4 w-4' />
                {editingBuildingId ? 'Update Building' : 'Add Building'}
              </button>

              {editingBuildingId && (
                <button
                  type='button'
                  onClick={resetBuildingForm}
                  className='rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className='space-y-3'>
            {buildings.map((building) => (
              <div
                key={building.id}
                className='flex flex-col justify-between gap-4 rounded-xl border p-4 md:flex-row md:items-center'
              >
                <div>
                  <h3 className='font-semibold'>{building.name}</h3>
                  <p className='text-sm text-gray-600'>{building.address}</p>
                  {building.description && (
                    <p className='mt-1 text-sm text-gray-500'>
                      {building.description}
                    </p>
                  )}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEditBuilding(building)}
                    className='rounded-lg border p-2 hover:bg-gray-50'
                    title='Edit'
                  >
                    <Pencil className='h-4 w-4' />
                  </button>

                  <button
                    onClick={() => handleDeleteBuilding(building.id)}
                    className='rounded-lg border p-2 hover:bg-red-50'
                    title='Delete'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'roomTypes' && (
        <Section title='Manage Room Types' icon={Tag}>
          <form
            onSubmit={handleRoomTypeSubmit}
            className='mb-8 grid gap-4 md:grid-cols-2'
          >
            <input
              required
              placeholder='Room type name'
              value={roomTypeForm.name}
              onChange={(e) =>
                setRoomTypeForm({
                  ...roomTypeForm,
                  name: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <input
              placeholder='Description'
              value={roomTypeForm.description}
              onChange={(e) =>
                setRoomTypeForm({
                  ...roomTypeForm,
                  description: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <div className='flex gap-2 md:col-span-2'>
              <button
                type='submit'
                className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white'
              >
                <Plus className='h-4 w-4' />
                {editingRoomTypeId
                  ? 'Update Room Type'
                  : 'Add Room Type'}
              </button>

              {editingRoomTypeId && (
                <button
                  type='button'
                  onClick={resetRoomTypeForm}
                  className='rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className='space-y-3'>
            {roomTypes.map((roomType) => (
              <div
                key={roomType.id}
                className='flex items-center justify-between gap-4 rounded-xl border p-4'
              >
                <div>
                  <h3 className='font-semibold'>{roomType.name}</h3>
                  {roomType.description && (
                    <p className='text-sm text-gray-500'>
                      {roomType.description}
                    </p>
                  )}
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEditRoomType(roomType)}
                    className='rounded-lg border p-2 hover:bg-gray-50'
                  >
                    <Pencil className='h-4 w-4' />
                  </button>

                  <button
                    onClick={() => handleDeleteRoomType(roomType.id)}
                    className='rounded-lg border p-2 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeTab === 'rooms' && (
        <Section title='Manage Rooms' icon={DoorOpen}>
          <form
            onSubmit={handleRoomSubmit}
            className='mb-8 grid gap-4 md:grid-cols-2'
          >
            <input
              required
              placeholder='Room name'
              value={roomForm.name}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  name: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <input
              required
              type='number'
              min='1'
              placeholder='Capacity'
              value={roomForm.capacity}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  capacity: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <select
              required
              value={roomForm.buildingId}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  buildingId: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            >
              <option value=''>Select building</option>

              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>

            <select
              required
              value={roomForm.roomTypeId}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  roomTypeId: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            >
              <option value=''>Select room type</option>

              {roomTypes.map((roomType) => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.name}
                </option>
              ))}
            </select>

            <input
              required
              type='time'
              value={roomForm.workingHoursStart}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  workingHoursStart: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <input
              required
              type='time'
              value={roomForm.workingHoursEnd}
              onChange={(e) =>
                setRoomForm({
                  ...roomForm,
                  workingHoursEnd: e.target.value,
                })
              }
              className='rounded-xl border px-4 py-3'
            />

            <div className='flex gap-2 md:col-span-2'>
              <button
                type='submit'
                className='inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white'
              >
                <Plus className='h-4 w-4' />
                {editingRoomId ? 'Update Room' : 'Add Room'}
              </button>

              {editingRoomId && (
                <button
                  type='button'
                  onClick={resetRoomForm}
                  className='rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50'
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className='space-y-3'>
            {rooms.map((room) => (
              <div
                key={room.id}
                className='flex flex-col justify-between gap-4 rounded-xl border p-4 md:flex-row md:items-center'
              >
                <div>
                  <h3 className='font-semibold'>{room.name}</h3>

                  <p className='text-sm text-gray-600'>
                    Capacity: {room.capacity}
                  </p>

                  <p className='text-sm text-gray-500'>
                    Building ID: {room.buildingId} · Room Type ID:{' '}
                    {room.roomTypeId}
                  </p>

                  <p className='text-sm text-gray-500'>
                    {formatTime(room.workingHoursStart)} -{' '}
                    {formatTime(room.workingHoursEnd)}
                  </p>
                </div>

                <div className='flex gap-2'>
                  <button
                    onClick={() => handleEditRoom(room)}
                    className='rounded-lg border p-2 hover:bg-gray-50'
                  >
                    <Pencil className='h-4 w-4' />
                  </button>

                  <button
                    onClick={() => handleDeleteRoom(room.id)}
                    className='rounded-lg border p-2 hover:bg-red-50'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}