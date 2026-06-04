'use client';

import { useState, useCallback } from 'react';
import Swal from 'sweetalert2';

export const parseBackendError = (error) => {
  if (!error) return {};

  const responseData = error.response?.data || error.data || error;

  const fieldErrors = {};

  if (Array.isArray(responseData.error)) {
    responseData.error.forEach((err) => {
      if (err.path && err.path.length > 0) {
        const fieldName = err.path[0];
        fieldErrors[fieldName] = err.message;
      }
    });
  } else if (responseData.errors && typeof responseData.errors === 'object') {
    Object.entries(responseData.errors).forEach(([key, messages]) => {
      if (Array.isArray(messages) && messages.length > 0) {
        fieldErrors[key] = messages[0];
      } else if (typeof messages === 'string') {
        fieldErrors[key] = messages;
      }
    });
  }

  const hasFieldErrors = Object.keys(fieldErrors).length > 0;
  const hasGlobalError = responseData.error && typeof responseData.error === 'string';
  const globalMessage = responseData.message || responseData.error || 'Error inesperado';

  return {
    fieldErrors,
    globalMessage,
    hasFieldErrors,
    hasGlobalError,
    originalError: error,
  };
};

export const useFieldErrors = () => {
  const [fieldErrors, setFieldErrors] = useState({});
  const [globalError, setGlobalError] = useState('');

  const setErrors = useCallback((error) => {
    const parsed = parseBackendError(error);

    setFieldErrors(parsed.fieldErrors || {});

    if (parsed.hasGlobalError && !parsed.hasFieldErrors) {
      setGlobalError(parsed.globalMessage);
    } else if (parsed.hasGlobalError && parsed.hasFieldErrors) {
      setGlobalError('');
    } else {
      setGlobalError('');
    }
  }, []);

  const getFieldError = useCallback((fieldName) => {
    return fieldErrors[fieldName] || '';
  }, [fieldErrors]);

  const hasError = useCallback((fieldName) => {
    return !!fieldErrors[fieldName];
  }, [fieldErrors]);

  const clearFieldError = useCallback((fieldName) => {
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
    setGlobalError('');
  }, []);

  const showGlobalAlert = useCallback((title = 'Error', message = '') => {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonColor: '#dc2626',
    });
  }, []);

  const showGlobalAlertFromError = useCallback((error, title = 'Error') => {
    const parsed = parseBackendError(error);
    if (parsed.hasFieldErrors) {
      const errorMessages = Object.entries(parsed.fieldErrors)
        .map(([field, message]) => `- ${field}: ${message}`)
        .join('\n');
      showGlobalAlert(title, errorMessages);
    } else if (parsed.hasGlobalError) {
      showGlobalAlert(title, parsed.globalMessage);
    }
  }, [showGlobalAlert]);

  return {
    fieldErrors,
    globalError,
    setErrors,
    getFieldError,
    hasError,
    clearFieldError,
    clearAllErrors,
    showGlobalAlert,
    showGlobalAlertFromError,
  };
};

export const getFieldErrorClass = (hasError) => {
  return hasError
    ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
    : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500';
};