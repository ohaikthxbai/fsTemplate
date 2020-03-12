// const axios = require('axios');
const fs = require('fs');
const unzip = require('unzip');
const readline = require('readline');
/*
 * files to modify with proxyName
 * api-proxy-template.xml (File name itself!)
 *  LINE 1: <APIProxy revision="1" name="api-proxy-template">
 *  LINE 2: <Basepaths>/api-proxy-template</Basepaths>
 *  LINE 7: <DisplayName>api-proxy-template</DisplayName>
 * proxies/default.xml
 *  LINE 18: <BasePath>/api-proxy-template</BasePath>
 */
const dirname = './tmp/apiproxy/'
let proxyName = 'api-data-category-service-description-proxy' //  hardcoded user input
let proxyTemplate = 'api-proxy-template' // may not need this

/*
 * function defintion:
 *      read the given file name
 *      check the file for the proxy template string: 'api-proxy-template'
 *      if the line in the file contains the template string, replace it with the user inputted proxy name
 *      create a new file with the new proxy name and modified file contents
 * 
 * thoughts:
 *  how to make this reusable?
 *  the way it's currently written, it only handles the api-proxy-template.xml
 *  if the default.xml is modified, the file will get replaced and encounter an endless loop
 * 
 * TODO:
 * once the file modification has finished, confirm and delete the old file
 */
const replaceValues = (fileName, replacementValue) => {
    
    // declare new file names to replace template files
    let newProxyFile = dirname + replacementValue + ".xml";
    let newDefaultFile = dirname + "proxies/new-default.xml"
    let newFile;

    // (asynchronously) read the contents of the given file
    templateData = fs.readFile(fileName, 'utf8', (error, data) => {
        if (error) {
            console.log(error);
            return error;
        }
        else {
            // checking given file
            if (fileName.includes("/proxies/")) {
                newFile = newDefaultFile;
            }
            else {
                newFile = newProxyFile
            }

            console.log("LOG | Modifying current file: " + fileName + "\n");
            console.log("LOG | User inputted proxy name: " + replacementValue + "\n");
            // console.log(data);

            // create a readable stream for the current file
            const readTemplate = fs.createReadStream(fileName, 'utf8');
            // console.log(readTemplate);
            let rl = readline.createInterface({
                input: readTemplate,
                crlfDelay: Infinity
            });

            // create a new file..?
            fs.writeFileSync(newFile, "", function (error) {
                if (error) {
                    console.log(error);
                    return error;
                }
            });

            let count = 0;
            // read each line, if no modification is needed, append to new file, otherwise, modify and append
            rl.on('line', (line) => {
                console.log(count + ": " + line);
                // if the current line in the file doesn't contain the template string, write to the new file
                if (!line.includes(proxyTemplate)) {
                    fs.appendFileSync(newFile, line + '\r\n', function (error) {
                        if (error) {
                            console.log("ERROR | \n")
                            console.log(error);
                            return error;
                        }
                    });
                }
                else {
                    // replace the template name with the user inputted proxy name
                    let newLine = line.replace(proxyTemplate, proxyName);
                    fs.appendFileSync(newFile, newLine + '\r\n', 'utf8', function (error) {
                        if (error) {
                            console.log(error)
                            return error;
                        }
                    });
                }
                count++;
            });
        }
    })
}

// TODO: DELETE 1) FILES, 2) EMPTY FOLDERS
// folder contents must be emptied before deletion
// use fs.unlink filename, etc. to remove them, then delete the directory
// const deleteFiles = (templateFile, proxyDefaultFile) => {
//     // this will have to wait for previous modifications to happen
//     // testing out deleting files here
//     fs.unlinkSync(templateFile);
//     fs.unlinkSync(proxyDefaultFile);

    // fs.rmdirSync(templateFolder, function (error) {
    //     if (error) {
    //         console.log(error);
    //         return error;
    //     }
    //     console.log("LOG | " + templateFolder + " successfully deleted!");
    // })
// }

// unzip the file to the temp directory
let unzipStream = fs.createReadStream('./tmp/apiproxy.zip').pipe(unzip.Extract({ path: './tmp' }));

// TODO? check if the file has already been unzippped?
unzipStream.on('close', function () { // unzip the file and once it has finished, do work
    console.log("UNZIPSTREAM | The folder has successfully unzipped.\n");

    // Read and display the FOLDER contents
    let templateFolderData = fs.readdirSync(dirname);
    console.log('START | Reading unzipped folder contents...\n');
    console.log(templateFolderData);
    console.log("");
    console.log('END | Folder contents displayed\n');
    let proxyFolderData = fs.readdirSync(dirname + templateFolderData[3]);
    // console.log(proxyFolderData);
    let templateFile = dirname + templateFolderData[0];
    let proxyDefaultFile = dirname + "proxies/" + proxyFolderData[0];


    // update the 'api-proxy-template' files with the proxy name input
    replaceValues(templateFile, proxyName);
    replaceValues(proxyDefaultFile, proxyName);

});
    // // Read and display FILE contents
    // fileData = fs.readFileSync(dirname + proxyTemplate + ".xml", 'utf8');
    // console.log("START | Displaying file contents of " + proxyTemplate + "...\n")
    // console.log(fileData);
    // console.log("END | " + proxyTemplate + ".xml contents displayed.\n");

    // CREATE A SEPARATE FUNCTION FOR THIS
    // creating a readstream for a specific file from the proxy-template folder
    // const readTemplate = fs.createReadStream(dirname + proxyTemplate + ".xml", 'utf8');
    // // THIS WORKS
    // let rl = readline.createInterface({
    //     input: readTemplate,
    //     crlfDelay: Infinity
    // });

    // // read and display each line of the file
    // let count = 0;
    // rl.on('line', (line) => {
    //     console.log(count + ": " + line);
    //     count++
    // });


    // replace any value that has the proxy template name with the proxyName param
    // let replaceTemplateVals = data.replace('api-proxy-template', proxyName); // this only replaces one instance of the value
    // console.log("START | Replacing template name with new values...\n")
    // console.log(replaceTemplateVals);
    // console.log("END | Replacing template name with new values complete.\n");
    // rl.on('line', function (line) {
    //     lineCount++;
    //     // console.log("line: " + lineCount);
    //     // console.log(line);
    //     if (line.includes('api-proxy-template')) {
    //         let modLine;
    //         console.log("START | Read each line and making modifications...")
    //         console.log("TEST | line: " + lineCount);
    //         console.log("TEST | " + line);
    //         console.log("TEST | This line contains the proxy name\n");
    //         console.log("TEST | replacing template name with new proxy name....");
    //         modLine = line.replace('api-proxy-template', proxyName);
    //         console.log("TEST | " + modLine);
    //         // fs.writeFile()
    //         console.log("END | line modification complete!\n");
    //     }
    // });
    // write a new file with modifications
    // fs.writeFileSync(dirname + proxyName + '.xml', replaceTemplateVals, 'utf-8');
    // fs.writeFileSync(dirname + 'api-proxy-template.xml', replaceTemplateVals, 'utf-8');
    // Consider overwriting the existing file instead of creating a new one

// });