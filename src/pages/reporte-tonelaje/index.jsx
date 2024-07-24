import fs from "fs";
import path from "path";

const ReporteTonelaje = ({data}) => {

  const groupedData = data.reduce((acc, curr) => {
    const key = `${curr.dim_name_material}-${curr.hour}`;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += curr.tons;
    return acc;
  }, {});

  const tableData = Object.keys(groupedData)
    .map((key) => {
      const [material, hour] = key.split("-");
      return { material, hour, tons: groupedData[key] };
    })
    .sort((a, b) => b.hour - a.hour);

  return (
    <table>
      <thead>
        <tr>
          <th>Hora</th>
          <th>Material</th>
          <th>Tonelaje</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, index) => (
          <tr key={index}>
            <td>{row.hour}</td>
            <td>{row.material}</td>
            <td>{row.tons}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export async function getStaticProps() {
  const filePath = path.join(
    process.cwd(),
    "public/data",
    "productionprev.json"
  );
  const jsonData = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(jsonData);

  return {
    props: {
      data,
    },
  };
}
export default ReporteTonelaje;
