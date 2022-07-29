function setConfig(projectss, rotationss, handlingss) {
    let config = {
        projectsList: projectss
            .replace(/(?:\r\n|\r|\n)/g, '')
            .split(',')
            .map(function (item) {
                return parseInt(item);
            }),
        rotationss: parseInt(rotationss),
        handlingss: parseInt(handlingss),
    };

    const projects = config.projectsList;
    const rotation = config.rotationss;
    const handle = config.handlingss;

    function findPM(projectsArray, projectRotation, projectHandling) {
        let table = [
            {
                projects: 0,
                multi: 0,
                old_pm: 0,
                new_pm: 0,
                remain: 0,
                need: 0,
                total: 0,
            },
        ];

        let oldPm = 0;
        let newPm = 0;
        let remainPrj = 0;
        let needPrj = 0;
        let total = 0;

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

            newPm = multiplier / projectHandling;
            remainPrj = multiplier - projectsArray[index];
            needPrj = remainPrj > 0 ? 1 : 0;

            for (let i = 1; i < table.length; i++) {
                newPm = Math.round(multiplier / projectsArray[index]) - needPrj;

                let remain01 = projectHandling * newPm;
                remainPrj = remain01 - (projectsArray[index] - table[i].remain);

                needPrj = remainPrj > 0 ? 1 : 0;
            }

            for (let i = projectRotation; i < table.length; i++) {
                let old_prep = table[i - i].new_pm - 1;
                let old_prep_2 = table[i - i].new_pm - old_prep;

                oldPm = table[i].need > 0 ? old_prep_2 + table[i].need : table[i].old_pm + table[i].new_pm;

                newPm = multiplier / projectHandling - oldPm;

                if (newPm < 0) {
                    newPm = 0;
                }

                let new_remains = projectsArray[index] - table[i].remain;
                let mul = multiplier / projectHandling;
                let new_mul = mul - table[i].need;
                let remain_main = new_mul * projectHandling;

                remainPrj = remain_main - new_remains;

                if (remainPrj < 0) {
                    remainPrj = projectHandling + remainPrj;
                }

                needPrj = remainPrj > 0 ? 1 : 0;
            }

            total = total + newPm;

            table.push({
                projects: projectsArray[index],
                multi: multiplier,
                old_pm: oldPm,
                new_pm: newPm,
                remain: remainPrj,
                need: needPrj,
                total: total,
            });
        }

        return table;
    }

    const data = findPM(projects, rotation, handle);

    const tableHead = `
      
          <tr>
              <th>Index</th>
              <th>Projects</th>
              <!-- <th>Multiplier</th> -->
              <th>Old</th>
              <th>New</th>
              <th>Remains</th>
              <th>Available</th>
              <th>Total</th>
          </tr>
      `;

    const html = data
        .map((da, index) => {
            return `
              <tr>
                  <td><b>${index}</b></td>
                  <td>${da.projects}</td>
                  <!-- <td>${da.multi}</td> -->
                  <td>${da.old_pm}</td>
                  <td>${da.new_pm}</td>
                  <td>${da.remain}</td>
                  <td>${da.need}</td>
                  <td>${da.total}</td>
              </tr>
          `;
        })
        .join('');

    const htmlTable = document.querySelector('#maintable');
    htmlTable.innerHTML = tableHead + html;
}
