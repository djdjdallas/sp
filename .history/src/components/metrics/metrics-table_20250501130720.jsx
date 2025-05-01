// src/components/metrics/metrics-table.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";

export function MetricsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Revenue</TableHead>
          <TableHead>Users</TableHead>
          <TableHead>Traffic</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">{row.projectName}</TableCell>
            <TableCell>
              {formatDistanceToNow(new Date(row.date), { addSuffix: true })}
            </TableCell>
            <TableCell>${row.revenue.toLocaleString()}</TableCell>
            <TableCell>{row.users.toLocaleString()}</TableCell>
            <TableCell>{row.traffic.toLocaleString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
