export default class ProcessLogger {
    constructor(settings) {
        this.processSettings = settings.processStatus;
        this.statusObj = {};

        this.reset();
    }

    //----------------------------------------------------- main -------------------------------------------------------

    reset() {
        let fields = {...this.processSettings.fields}; // clone
        this.statusObj = {};
        this.statusObj = fields;
    }

    getStatus() {
        return this.statusObj;
    }

    startProcess(){
        this.reset();
        this.setStatusBusy('busy');
        this.setStatusStep('start');
        this.setStatusTimeField('started');
    }

    finishProcess(){
        this.setStatusBusy('not_busy');
        this.setStatusStep('finish');
        this.setStatusTimeField('finished');
    }

    //---------------------------------------------------- slug --------------------------------------------------------

    setStatusBusy(busyKey){
        if(this.processSettings.status.hasOwnProperty(busyKey)){
            this.statusObj['is_busy'] = this.processSettings.status[busyKey];
        }
    }
    setStatusStep(stepKey){
        if(this.processSettings.step.hasOwnProperty(stepKey)){
            this.statusObj['step'] = this.processSettings.step[stepKey];
        }
    }
    setStatusTimeField(field, value = null){
        const timeFields = ['started', 'finished'];
        if(timeFields.includes(field) && this.statusObj.hasOwnProperty(field)){
            this.statusObj[field] = !isNaN(parseInt(value)) ? parseInt(value) : +new Date;
        }
    }

    setStatusElementsCount(elementsCount = 0){
        this.statusObj['elements_to_process_count'] = elementsCount;
    }

//------------------------------
//     getStatus() {
//         return this.status;
//     }

    // setStatusBusy(linksCount = -1) {
    //     this.status['is_busy'] = 1;
    //     this.status['started'] = +new Date;
    //     this.status['countItems'] = linksCount;
    // }
    //
    // setStatusStep(stepKey) {
    //     if (this.settings.processStatus.step.hasOwnProperty(stepKey)) {
    //         this.status['step'] = this.settings.processStatus.step[stepKey];
    //     }
    // }

    // setStatusFree() {
    //     let self = this;
    //     for (let key in self.status) {
    //         self.status[key] = null;
    //     }
    // }
}