import React, { memo, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Typography } from '@material-ui/core';
import { VideosTable } from '../components/videos-table';
import { Search } from '../components/search';
import { getVideos, deleteVideo } from '../services/videos';
import { ProcessedVideo } from '../common/interfaces';

export default memo(function Home() {
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [allVideos, setAllVideos] = useState([]);
  const [activeSort, setActiveSort] = useState('');
  const history = useHistory();

  const handleSearchClicked = (searchValue: string) => {
    // filter by searchKey
    if (searchValue) {
      const filteredVideos = videos.filter((video) => video.name.toLowerCase().includes(searchValue.toLowerCase()));
      setVideos(filteredVideos);
    } else {
      setVideos(allVideos);
    }
  };

  const handleColumnClicked = (column) => {
    const sortedVideos = [...videos].sort((a, b) => {
      // change sort direction if already sorted
      if (column.key === activeSort) {
        setActiveSort('');
        return a[column.key].toLowerCase().localeCompare(b[column.key].toLowerCase()) * -1;
      } else {
        setActiveSort(column.key);
        return a[column.key].toLowerCase().localeCompare(b[column.key].toLowerCase());
      }
    });
    setVideos(sortedVideos);
  };

  const handleDeleteClicked = async (video) => {
    if (window.confirm(`Are you sure you want to delete ${video.name}`)) {
      await deleteVideo(video);
      setVideos(videos.filter((v) => v.id !== video.id));
    }
  };

  const handleEditClicked = async (video) => {
    history.push(`/videoForm/edit/${video.id}`, { ...video, categories: video.categories.split(', ') });
  };

  useEffect(() => {
    getVideos().then((videos) => {
      console.log({ videos });
      setAllVideos(videos);
      setVideos(videos);
    });
  }, []);

  return (
    <Container>
      <Typography variant="h3">VManager Demo v0.0.1</Typography>
      <Search onClick={handleSearchClicked} />
      <VideosTable
        onColumnClicked={handleColumnClicked}
        videos={videos}
        onEditClicked={handleEditClicked}
        onDeleteClicked={handleDeleteClicked}
      />
    </Container>
  );
});
