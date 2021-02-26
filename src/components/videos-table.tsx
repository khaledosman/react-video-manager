import React, { memo } from 'react';
import { Paper, Table, TableBody, TableCell, Button, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { ProcessedVideo } from '../common/interfaces';

interface Column {
  key: string;
  label: string;
}

interface VideosTableProps {
  videos: ProcessedVideo[];
  onColumnClicked: (column: Column) => void;
  onDeleteClicked: (video: ProcessedVideo) => void;
  onEditClicked: (video: ProcessedVideo) => void;
}

const buttonStyles = {
  margin: '0px 5px',
};

const columns = [
  {
    key: 'name',
    label: 'Video Name',
  },
  {
    key: 'author',
    label: 'Author',
  },
  {
    key: 'categories',
    label: 'Categories',
  },
  {
    key: 'highestQualityFormat',
    label: 'Highest Quality Format',
  },
  {
    key: 'releaseDate',
    label: 'Release Date',
  },
];

export const VideosTable: React.FC<VideosTableProps> = memo(({ videos, onColumnClicked, onDeleteClicked, onEditClicked }) => {
  const handleColumnClickedClick = (column: Column) => {
    return (e) => {
      e.stopPropagation();
      onColumnClicked(column);
    };
  };
  const handleDeleteClicked = (video: ProcessedVideo) => {
    return (e) => {
      e.stopPropagation();
      onDeleteClicked(video);
    };
  };

  const handleEditClicked = (video: ProcessedVideo) => {
    return (e) => {
      e.stopPropagation();
      onEditClicked(video);
    };
  };

  return (
    <TableContainer component={Paper} style={{ marginTop: '40px' }}>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell onClick={handleColumnClickedClick(column)} key={column.key} style={{ fontWeight: 'bold' }}>
                {column.label}
              </TableCell>
            ))}
            <TableCell key="options" style={{ fontWeight: 'bold' }}>
              {' '}
              Options{' '}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {videos.map((video) => (
            <TableRow key={video.id}>
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {Array.isArray(video[column.key]) ? video[column.key].join(', ') : video[column.key]}
                </TableCell>
              ))}
              <TableCell>
                <Button style={buttonStyles} variant="contained" color="primary" onClick={handleEditClicked(video)}>
                  {' '}
                  Edit{' '}
                </Button>
                <Button style={buttonStyles} variant="contained" color="secondary" onClick={handleDeleteClicked(video)}>
                  {' '}
                  Delete{' '}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
});
