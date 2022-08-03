function setConfig() {
    // projectss, rotationss, handlingss
    // let config = {
    //     projectsList: projectss
    //         .replace(/(?:\r\n|\r|\n)/g, '')
    //         .split(',')
    //         .map(function (item) {
    //             return parseInt(item);
    //         }),
    //     rotationss: parseInt(rotationss),
    //     handlingss: parseInt(handlingss),
    // };

    function findMultiplier(project, handle) {
        let new_handle = handle;
        let mul = new_handle / project;

        while (mul < 1) {
            new_handle = new_handle + handle;
            mul = new_handle / project;
        }

        return new_handle;
    }

    const projects = [
        5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15, 15, 20, 20, 20, 20, 20, 20, 25, 25, 25, 25, 25, 25, 30,
        30, 30, 30, 30, 30, 35, 35, 35, 35, 35, 35, 40, 40, 40, 40, 40, 40, 45, 45, 45, 45, 45, 45, 50, 50, 50, 50, 50, 50,
    ];
    const rotation = 4;
    const handle = 4;

    function findPM(projectsArray, projectRotation, projectHandling) {
        let table = [
            {
                projects: 0,
                multi: 0,
                old_p: 0,
                new_p: 0,
                remain: 0,
                need: 0,
                total: 0,
            },
        ];

        let oldP = 0;
        let newP = 0;
        let remainPrj = 0;
        let needPrj = 0;
        let total = 0;

        for (let index in projectsArray) {
            let multiplier = findMultiplier(projectsArray[index], projectHandling);

            newP = multiplier / projectHandling;

            total = total + newPm;

            table.push({
                projects: projectsArray[index],
                multi: multiplier,
                old_p: oldP,
                new_p: newP,
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
              <th>Multiplier</th>
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
                  <td>${da.multi}</td>
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
