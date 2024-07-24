import fs from "fs";
import path from "path";
import ReactECharts from "echarts-for-react";

const ListaViajes = ({ data }) => {
  const groupedData = data.reduce((acc, curr) => {
    const key = `${curr.locationdump}-${curr.loadingequipmentname}`;
    if (!acc[key]) {
      acc[key] = 0;
    }
    acc[key] += curr.tons;
    return acc;
  }, {});

  const categories = [...new Set(data.map((item) => item.locationdump))];
  const seriesNames = [
    ...new Set(data.map((item) => item.loadingequipmentname)),
  ];

  const seriesData = seriesNames.map((name) => ({
    name,
    type: "bar",
    stack: "total",
    data: categories.map((category) => groupedData[`${category}-${name}`] || 0),
  }));

  const option = {
    title: {
      text: "Tonelaje por zona de descarga y equipo de carga",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    legend: {
      data: seriesNames,
    },
    xAxis: {
      type: "category",
      data: categories,
    },
    yAxis: {
      type: "value",
    },
    series: seriesData,
  };

  return <ReactECharts option={option} />;
};

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

export default ListaViajes;
