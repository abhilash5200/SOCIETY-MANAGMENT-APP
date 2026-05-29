import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

const BookingForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const facility = location.state?.facility;

  const [formData, setFormData] = useState({
    date: '',
    timeSlot: ''
  });

  const [availability, setAvailability] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if no facility selected
  useEffect(() => {
    if (!facility) {
      navigate('/resident/facilities');
    }
  }, [facility, navigate]);

  // Fetch availability when date changes
  useEffect(() => {
    if (formData.date && facility) {
      fetchAvailability();
    }
  }, [formData.date]);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get('/facilities/availability/check', {
        params: {
          facilityId: facility._id,
          date: formData.date
        }
      });

      // Handle both wrapped and unwrapped response formats
      let availabilityData;
      if (response.data?.data) {
        availabilityData = response.data;
      } else if (response.data?.availability) {
        availabilityData = { data: response.data };
      } else {
        availabilityData = response.data;
      }
      setAvailability(availabilityData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch availability');
      setAvailability(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      setError('Cannot book for past dates');
      setFormData({ ...formData, date: '' });
      return;
    }

    setFormData({ ...formData, date: e.target.value });
    setError('');
  };

  const handleTimeSlotChange = (e) => {
    setFormData({ ...formData, timeSlot: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date || !formData.timeSlot) {
      setError('Please select both date and time slot');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await axios.post('/facilities/book/create', {
        facilityId: facility._id,
        date: formData.date,
        timeSlot: formData.timeSlot
      });

      setSuccess('Facility booked successfully!');
      setFormData({ date: '', timeSlot: '' });
      setAvailability(null);

      setTimeout(() => {
        navigate('/resident/my-bookings');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book facility');
    } finally {
      setSubmitting(false);
    }
  };

  if (!facility) {
    return null;
  }

  // Get minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  // Get maximum date (90 days from today)
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back button */}
        <button
          onClick={() => navigate('/resident/facilities')}
          className="mb-6 inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Facilities
        </button>

        {/* Facility details card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {facility.name}
          </h1>

          <div className="grid grid-cols-2 gap-6 text-gray-700">
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-semibold mt-1">
                {facility.description || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-semibold mt-1">{facility.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capacity</p>
              <p className="font-semibold mt-1">{facility.capacity} persons</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="font-semibold mt-1 text-green-600">Active</p>
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Book This Facility
          </h2>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Date
              </label>
              <input
                type="date"
                min={minDate}
                max={maxDateStr}
                value={formData.date}
                onChange={handleDateChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Select a date within 90 days
              </p>
            </div>

            {/* Time slot selection */}
            {formData.date && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time Slot
                </label>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : availability ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availability.data.availability.map((slot) => (
                      <button
                        key={slot.timeSlot}
                        type="button"
                        onClick={() =>
                          handleTimeSlotChange({
                            target: { value: slot.timeSlot }
                          })
                        }
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          formData.timeSlot === slot.timeSlot
                            ? 'border-blue-600 bg-blue-50'
                            : slot.available
                            ? 'border-gray-200 hover:border-blue-400'
                            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="font-semibold text-gray-900">
                          {slot.timeSlot}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {slot.available ? 'Available' : 'Booked'}
                        </div>
                        {!slot.available && (
                          <div className="text-xs text-gray-400 mt-1">
                            {slot.booked}/{slot.capacity}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                ) : null}

                {availability?.data.isFullyBooked && (
                  <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                    <p className="font-semibold">This facility is fully booked for the selected date</p>
                  </div>
                )}
              </div>
            )}

            {/* Submit button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting || !formData.date || !formData.timeSlot}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>

              <button
                type="button"
                onClick={() => navigate('/resident/facilities')}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
