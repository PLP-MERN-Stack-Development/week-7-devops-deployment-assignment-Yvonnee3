import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Register = () => {
  const formRef = useRef(null);
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useUser();
  const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(''); // Track selected role

const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
   
  });
  setIsLoading(true);

  const formValues = {
    email: formRef.current.email.value,
    password: formRef.current.password.value,
    firstName: formRef.current.firstName.value,
    lastName: formRef.current.lastName.value,
    
  };

  try {
    const result = await register(
      formValues.email,
      formValues.password,
      formValues.firstName,
      formValues.lastName,
     
    );

    if (result.success) {
      // User is now logged in automatically via the token
      navigate('/home');
    } else if (result.errors) {
      setErrors(result.errors);
    }
  } catch (error) {
    setErrors({ general: 'Registration failed. Please try again.' });
    console.log(error)
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our task manager today
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-6">
          {errors.general && (
            <div className="alert-danger">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                required
                disabled={isLoading}
                className="form-input"
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <div className="form-error">{errors.firstName}</div>
              )}
            </div>

            <div>
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                required
                disabled={isLoading}
                className="form-input"
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <div className="form-error">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              disabled={isLoading}
              className="form-input"
              placeholder="Enter your email address"
            />
            {errors.email && (
              <div className="form-error">{errors.email}</div>
            )}
          </div>

          <div>
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              disabled={isLoading}
              className="form-input"
              placeholder="Create a secure password"
            />
            {errors.password && (
              <div className="form-error">{errors.password}</div>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 text-base"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <div className="spinner mr-2 h-4 w-4"></div>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Sign in here
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register