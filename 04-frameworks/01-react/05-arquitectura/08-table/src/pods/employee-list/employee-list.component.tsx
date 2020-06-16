import React from 'react';
import { Employee } from './employee-list.vm';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';

interface Props {
  employees: Employee[];
}

export const EmployeeListComponent: React.FunctionComponent<Props> = ({
  employees,
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="right">Activo</TableCell>
            <TableCell align="right">Id</TableCell>
            <TableCell align="right">Nombre</TableCell>
            <TableCell align="right">Email</TableCell>
            <TableCell align="right">Fecha último incurrido</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {employees.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                <Checkbox checked={row.isActive} disabled />
              </TableCell>
              <TableCell align="right">{row.id}</TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">
                {row.lastDateIncurred}
                <IconButton onClick={() => console.log('on Edit: ${row.id}')}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => console.log('on Delete: ${row.id}')}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
