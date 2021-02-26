import React, { memo, useState, useEffect, useCallback } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';
import { Button, Container } from '@material-ui/core';
import './video-form.css';
import { getCategories } from '../services/categories';
import { getAuthors } from '../services/authors';
import { Category, Author } from '../common/interfaces';
import { createVideo, editVideo } from '../services/videos';

export default memo(function VideoForm() {
  const { videoId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const [authors, setAuthors] = useState<Array<Author>>([]);
  const [isSubmitDisabled, setSubmitDisabled] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    categories: [],
    formats: {
      one: { res: '1080p', size: 1000 },
    },
  });
  const [categories, setCategories] = useState<Array<Category>>([]);

  useEffect(() => {
    // reset state when user navigates to /new page from /edit page, since both routes use the same component
    const video = location.state;

    setFormData({
      formats: {
        one: { res: '1080p', size: 1000 },
      },
      name: video?.name || '',
      author: video?.author || '',
      categories: video?.categories || [],
    });
    setIsEditMode(videoId && video);
  }, [location, videoId]);

  useEffect(() => {
    // form validation
    if (formData.name && formData.author && formData.categories.length) {
      setSubmitDisabled(false);
    }
  }, [formData]);

  useEffect(() => {
    // set autocomplete data on initial load
    Promise.all([getCategories(), getAuthors()]).then(([categories, authors]) => {
      setCategories(categories);
      setAuthors(authors);
      setFormData((formData) => ({ ...formData, author: authors[0].name }));
    });
  }, [setCategories, setAuthors, setFormData]);

  const handleCancelClicked = useCallback(
    (e) => {
      history.push('/');
    },
    [history]
  );

  const handleInputChanged = useCallback(
    (e) => {
      if (e.target.type === 'select-multiple') {
        /* @ts-ignore */
        setFormData((formData) => ({ ...formData, [e.target.name]: Array.from(e.target.selectedOptions).map((x) => x.value) }));
      } else {
        setFormData((formData) => ({ ...formData, [e.target.name]: e.target.value }));
      }
    },
    [setFormData]
  );

  const handleSubmitClicked = useCallback(
    async (e) => {
      e.preventDefault();
      if (isSubmitDisabled) {
        return;
      }

      if (isEditMode) {
        await editVideo(videoId, formData);
      } else {
        await createVideo(formData);
      }
      history.push('/');
    },
    [isSubmitDisabled, isEditMode, history, videoId, formData]
  );

  return (
    <Container>
      <form className="video-form" onSubmit={handleSubmitClicked}>
        <div className="video-form__field">
          <label>Video name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleInputChanged}
            className="video-form__field_input"
            type="text"
            placeholder="video name"
          />
        </div>

        <div className="video-form__field">
          <label>Video author </label>
          <select name="author" className="video-form__field_input" value={formData.author} onChange={handleInputChanged}>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        <div className="video-form__field">
          <label>Video Category</label>

          <select name="categories" multiple className="video-form__field_input" value={formData.categories} onChange={handleInputChanged}>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="video-form__buttons">
          <Button disabled={isSubmitDisabled} variant="contained" color="primary" onClick={handleSubmitClicked}>
            Submit
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleCancelClicked}>
            Cancel
          </Button>
        </div>
      </form>
    </Container>
  );
});
