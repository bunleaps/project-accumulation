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

  function findBA(projectsArray, projectRotation, projectHandling) {
    let table = [
      {
        projects: 0,
        multi: 0,
        old_ba: 0,
        new_ba: 0,
        remain: 0,
        need: 0,
      },
    ];

    let oldBa = 0;
    let newBa = 0;
    let remainPrj = 0;
    let needPrj = 0;

    function findMultiplier(project, handle) {
      let new_handle = handle;
      let mul = new_handle / project;

      while (mul < 1) {
        new_handle = new_handle + handle;
        mul = new_handle / project;
      }

      return new_handle;
    }

    for (let index in projectsArray) {
      let multiplier = findMultiplier(projectsArray[index], projectHandling);

      newBa = Math.round(multiplier / projectsArray[index]);
      remainPrj = multiplier - projectsArray[index];
      needPrj = remainPrj > 0 ? 1 : 0;

      for (let i = 1; i < table.length; i++) {
        newBa = needPrj;

        let remain01 = projectHandling * newBa;
        remainPrj = remain01 - (projectsArray[index] - table[i].remain);

        needPrj = remainPrj > 0 ? 1 : 0;
      }

      for (let o = projectRotation; o < table.length; o++) {
        oldBa = table[o].need;
      }

      for (let i = projectRotation + 1; i < table.length; i++) {
        let old_prep = table[i - i].new_ba - 1;
        let old_prep_2 = table[i - i].new_ba - old_prep;

        oldBa = table[i].need > 0 ? old_prep_2 + table[i].need : old_prep_2;

        if (table[i].remain == projectsArray[index]) {
          oldBa = 1;
        }

        newBa = Math.ceil(multiplier / projectHandling) - oldBa;

        if (newBa < 0) {
          newBa = 0;
        }

        let new_remains = projectsArray[index] - table[i].remain;
        let mul = multiplier / projectHandling;
        let new_mul = mul - table[i].need;
        let remain_main = new_mul * projectHandling;

        remainPrj = remain_main - new_remains;

        if (remainPrj < 0) {
          newBa += 1;
          remainPrj = projectHandling + remainPrj;
        }

        needPrj = remainPrj > 0 ? 1 : 0;
      }

      table.push({
        projects: projectsArray[index],
        multi: multiplier,
        old_ba: oldBa,
        new_ba: newBa,
        remain: remainPrj,
        need: needPrj,
      });
    }

    return table;
  }

  const data = findBA(projects, rotation, handle);

  const tableHead = `
      
          <tr>
              <th>Index</th>
              <th>Projects</th>
              <!-- <th>Multiplier</th> -->
              <th>Old</th>
              <th>New</th>
              <th>Remains</th>
              <th>Available</th>
          </tr>
      `;

  const html = data
    .map((da, index) => {
      return `
              <tr>
                  <td><b>${index}</b></td>
                  <td>${da.projects}</td>
                  <!-- <td>${da.multi}</td> -->
                  <td>${da.old_ba}</td>
                  <td>${da.new_ba}</td>
                  <td>${da.remain}</td>
                  <td>${da.need}</td>
              </tr>
          `;
    })
    .join("");

  const htmlTable = document.querySelector("#maintable");
  htmlTable.innerHTML = tableHead + html;
}
