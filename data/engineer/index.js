// Initialized Pre-Data
const prj = [
    1, 1, 2, 2, 2, 2, 10, 10, 10, 10, 10, 10, 41, 3, 13, 13, 13, 21, 46, 46, 46, 46, 46, 46, 46, 0, 42, 42, 42, 75, 44, 44,
    44, 44, 44, 44, 44, 0, 40, 40, 40, 96, 42, 42, 42, 42, 42, 42, 42, 0, 38, 38, 38, 115, 40, 40, 40, 40, 40, 40,
];
const rot = 4;
const res = 5;
const atr = 10;

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

    // Initialized Simulator
    function EngineerSimulator(projectsArray, projectRotation, projectResource, attritionRate) {
        // Setup
        let table = [
            {
                projects: 0,
                oldEngineer: 0,
                newEngineer: 0,
                totalEngineer: 0,
                accumulate: 0,
                engineerTotal: 0,
            },
        ];
        let oldEngineer = 0;
        let newEngineer = 0;
        let totalEngineer = 0;
        let accumulateTotal = 0;
        let engineerTotal = 0;

        // Simulation
        for (let index in projectsArray) {
            let attrition = attritionRate / 100;

            totalEngineer = projectResource * projectsArray[index];
            newEngineer = totalEngineer;
            accumulateTotal = newEngineer;

            if (attrition == 0) {
                for (let n = projectRotation; n < table.length; n++) {
                    oldEngineer =
                        table[n - (projectRotation - 1)].newEngineer + table[n - (projectRotation - 1)].oldEngineer;

                    newEngineer = totalEngineer - oldEngineer;

                    if (newEngineer < 0) {
                        newEngineer = 0;
                    }
                }
            } else {
                for (let i = 0; i < table.length; i++) {
                    oldEngineer = table[i].accumulate;
                    oldEngineer = Math.round(attrition * oldEngineer);

                    newEngineer = totalEngineer - oldEngineer;

                    if (newEngineer < 0) {
                        oldEngineer = oldEngineer - Math.abs(newEngineer);
                        newEngineer = 0;
                    }

                    accumulateTotal = table[i].accumulate + newEngineer;
                }
            }

            engineerTotal = engineerTotal + newEngineer;

            table.push({
                projects: projectsArray[index],
                oldEngineer: oldEngineer,
                newEngineer: newEngineer,
                totalEngineer: totalEngineer,
                accumulate: accumulateTotal,
                engineerTotal: engineerTotal,
            });
        }

        return table;
    }

    // Display Informations
    const data = EngineerSimulator(projects, rotation, handle, attritions);

    const tableHead = `
	        <tr>
	            <th>Index</th>
	            <th>Projects</th>
	            <th>Total</th>
	            <th>Old</th>
	            <th>New</th>
	            <th>Accumulate</th>
                <th>Engineer Total</th>
	        </tr>
	    `;

    const html = data
        .map((info, index) => {
            return `
	            <tr>
	                <td><b>${index}</b></td>
	                <td>${info.projects}</td>
	                <td>${info.totalEngineer}</td>
	                <td>${info.oldEngineer}</td>
	                <td>${info.newEngineer}</td>
	                <td>${info.accumulate}</td>
                    <td>${info.engineerTotal}</td>
	            </tr>
	        `;
        })
        .slice(1)
        .join('');

    const htmlTable = document.querySelector('#maintable');
    htmlTable.innerHTML = tableHead + html;
}
