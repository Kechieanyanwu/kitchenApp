import BackButton from "./BackButton";
import { TableHeaderProps } from "../utils/interfaces";

export default function TableHeader({ title, subtitle }: TableHeaderProps) {
  return (
    <div className="checklist-header">
      <table>
        <tbody>
          <tr>
            <BackButton />
            <td>{title}</td>
          </tr>
          <tr>
            <td colSpan={2}>{subtitle}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}