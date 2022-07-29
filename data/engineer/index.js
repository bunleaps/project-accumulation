function setConfig(projectss, rotationss, handlingss) {
  let config = {
    projectsList: projectss
      .replace(/(?:\r\n|\r|\n)/g, "")
      .split(",")
      .map(function (item) {
        return parseInt(item);
      }),
    rotationss: parseInt(rotationss),
    handlingss: parseInt(handlingss),
  };

  const projects = config.projectsList;
  const rotation = config.rotationss;
  const handle = config.handlingss;

  function findEng(projectsArray, projectRotation, projectHandling) {
    let table = [
      {
        projects: 0,
        multi: 0,
        old_eng: 0,
        new_eng: 0,
        total: 0,
      },
    ];

    let oldEng = 0;
    let newEng = 0;
    let total = 0;

    for (let index in projectsArray) {
      let resource = projectHandling * projectsArray[index];
      newEng = resource;

      for (let num = projectRotation; num < table.length; num++) {
        oldEng = table[num - (projectRotation - 1)].new_eng;
        newEng = resource - oldEng;

        if (newEng < 0) {
          newEng = 0;
        }
      }

      total = total + newEng;

      table.push({
        projects: projectsArray[index],
        old_eng: oldEng,
        new_eng: newEng,
        total: total,
      });
    }

    return table;
  }

  const data = findEng(projects, rotation, handle);

  const tableHead = `
        
            <tr>
                <th>Index</th>
                <th>Projects</th>
                <th>Old</th>
                <th>New</th>
                <th>Total</th>
            </tr>
        `;

  const html = data
    .map((info, index) => {
      return `
                <tr>
                    <td><b>${index}</b></td>
                    <td>${info.projects}</td>
                    <td>${info.old_eng}</td>
                    <td>${info.new_eng}</td>
                    <td>${info.total}</td>
                </tr>
            `;
    })
    .join("");

  const htmlTable = document.querySelector("#maintable");
  htmlTable.innerHTML = tableHead + html;
}
