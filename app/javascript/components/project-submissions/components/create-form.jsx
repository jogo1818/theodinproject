import React, { useContext, useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import PropTypes from 'prop-types';
import { yupResolver } from '@hookform/resolvers/yup';

import schema from '../schemas/project-submission-schema';
import ProjectSubmissionContext from '../ProjectSubmissionContext';
import Toggle from './toggle';

const CreateForm = ({ onClose, onSubmit }) => {
  const [isToggled, setIsToggled] = useState(true);
  const { lesson } = useContext(ProjectSubmissionContext);
  const {
    register,
    handleSubmit,
    formState,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      is_public: isToggled,
    },
  });

  const handleOnClickToggle = () => {
    setIsToggled(!isToggled);
  };

  const handleSubmitCallback = async (data) => (
    onSubmit({ ...data, is_public: isToggled })
  );

  const {
    errors,
  } = formState;

  if (formState.isSubmitSuccessful) {
    return (
      <div className="text-center">
        <h1 className="page-heading-title" data-test-id="success-message">Thanks for Submitting Your Solution!</h1>
        <button
          type="button"
          className="button button--primary"
          onClick={onClose}
          data-test-id="close-btn"
        >
          Close
        </button>
      </div>
    );
  }

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <div>
      <h1 className="text-center page-heading-title">Upload Your Project</h1>

      <form className="form" onSubmit={handleSubmit(handleSubmitCallback)}>
        <div class="flex flex-col space-y-4">
          <div>
            <label htmlFor="repo_url" className="block text-sm font-medium text-gray-700 text-left">Github repository url</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-700 fab fa-github" />
              </div>
              <input
                type="url"
                autoFocus
                id="repo_url"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                placeholder="https://github.com"
                data-test-id="repo-url-field"
                {...register('repo_url')}
              />
            </div>
            {errors.repo_url && (
            <div className="mt-2 text-sm text-red-600" data-test-id="error-message">
              {' '}
              {errors.repo_url.message}
            </div>
            )}
          </div>

          { lesson.has_live_preview
            && (
            <Fragment>
              <div>
                <label htmlFor="live_preview_url" className="block text-sm font-medium text-gray-700 text-left">Live preview url</label>
                <div className="mt-1 relative rounded-md shadow-sm ">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-700 fas fa-link" />
                  </div>
                  <input
                    type="url"
                    id="live_preview_url"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 border-gray-300 rounded-md"
                    placeholder="https://www.example.com"
                    data-test-id="live-preview-url-field"
                    {...register('live_preview_url')}
                  />
                </div>
                { errors.live_preview_url && (
                <div className="mt-2 text-sm text-red-600" data-test-id="error-message">
                  {' '}
                  {errors.live_preview_url.message}
                </div>
                ) }
              </div>
            </Fragment>
            )}
        </div>

        <div className="form-section form-section-center pt-8 lg:flex-row lg:justify-center mb-0">
          <Toggle
            label="MAKE SOLUTION PUBLIC"
            onClick={handleOnClickToggle}
            isToggled={isToggled}
          />

          <button
            disabled={formState.isSubmitting}
            type="submit"
            className="button button--primary"
            data-test-id="submit-btn"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
  /* eslint-enable react/jsx-props-no-spreading */
};

CreateForm.defaultProps = {
  userId: null,
};

CreateForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  userId: PropTypes.number,
};

export default CreateForm;
