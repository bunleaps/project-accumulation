function setConfig(projectss, rotationss, handlingss, attritionss) {
    let config = {
        projectsList: projectss
            .replace(/(?:\r\n|\r|\n)/g, '')
            .split(',')
            .map(function (item) {
                return parseInt(item);
            }),
        rotationss: parseInt(rotationss),
        handlingss: parseInt(handlingss),
        attritionss: parseInt(attritionss),
    };

    const projects = config.projectsList;
    const rotation = config.rotationss;
    const handle = config.handlingss;
    const attritions = config.attritionss;

    function findEng(projectsArray, projectRotation, projectHandling, attritionRate) {
        let table = [
            {
                projects: 0,
                projects_after_attr: 0,
                multi: 0,
                old_eng: 0,
                new_eng: 0,
                total: 0,
            },
        ];

        let oldEng = 0;
        let newEng = 0;
        let total = 0;
        let prj_after_attr = 0;

        for (let index in projectsArray) {

            let resource = projectHandling * projectsArray[index];
            newEng = resource;

            let attrition_Rate = attritionRate / 100;

            for (let num = projectRotation; num < table.length; num++) {

                oldEng = table[num - (projectRotation - 1)].new_eng + table[num - (projectRotation - 1)].old_eng;

                // if(attrition_Rate == 0) {
                //     // Bug #1
                //     oldEng = oldEng;

                //     // Possible Fix
                //     // 1) Write new variable for new_eng
                //     // 2) something is wrong in the (oldEng == 0)
                // } else {
                    oldEng = Math.ceil(attrition_Rate * oldEng);
                // }
                
                newEng = resource - oldEng;

                if (newEng < 0) {
                    newEng = 0;
                }
            }

            total = total + newEng;

            prj_after_attr = prj_after_attr + projectsArray[index];
            prj_after_attr = Math.ceil(attrition_Rate * prj_after_attr);

            if (prj_after_attr == 0) {
                prj_after_attr = projectsArray[index];
            }

            if (projectsArray[index] == 0) {
                prj_after_attr = 0;
            }

            table.push({
                projects: projectsArray[index],
                projects_after_attr: prj_after_attr,
                old_eng: oldEng,
                new_eng: newEng,
                total: total,
            });
        }

        return table;
    }

    const data = findEng(projects, rotation, handle, attritions);

    const tableHead = `
            <tr>
                <th>Index</th>
                <th>Projects</th>
                <th>Projects after Attrition</th>
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
                    <td>${info.projects_after_attr}</td>
                    <td>${info.old_eng}</td>
                    <td>${info.new_eng}</td>
                    <td>${info.total}</td>
                </tr>
            `;
        })
        .join('');

    const htmlTable = document.querySelector('#maintable');
    htmlTable.innerHTML = tableHead + html;
}
