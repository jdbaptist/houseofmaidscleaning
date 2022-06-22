const User = require("../models/users.model");
const ServiceRequest = require("../models/service-request.model");
var fs = require("fs");
const path = require('path');
const csv = require('fast-csv');

exports.exportCsvCustomer = async (req, res) => {
    try {
        // console.log('customer export csv')
        let paths = path.join(__dirname,'../../csv')
        let filename = Date.now() + "customer.csv";
        paths = paths + "/" + filename;
        var writerStream = fs.createWriteStream(paths);
        let list = await User.find({ role: 1 },{
            _id:0,
            active:0,
            profile_status:0,
            password:0 ,
            deleted:0,
            __v:0           
        }, {deleted: false,}).sort({ createdAt: -1 }) //role 1 customer
        let data = JSON.parse(JSON.stringify(list));
   
        const csvStream = csv.format({ headers: true });

        csvStream.pipe(writerStream).on("end", data => console.log("end",data))
          .on("finish", data => 
            res.download(paths)
          )
          .on("error", error => 
            console.log("error",error)
          );
          data.map((result)=>{
            csvStream.write(result);
         })
         
        csvStream.end();
          if (!data) {
            throw new Error("Server error occured");
          }
        //   return res.status(200).send({
        //     status: true,
        //     status_code: 200,
        //     data,
        //     message: "customer csv  fetch successfully",
        //   });
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            message: error.message ? error.message : "Error while export custmers csv ",
        });
    }
};


exports.exportCsvCleaner = async (req, res) => {
    try {
        let paths = path.join(__dirname,'../../csv')
        let filename = Date.now() + "cleaner.csv";
        paths = paths + "/" + filename;
        var writerStream = fs.createWriteStream(paths);
        let list = await User.find({ role: 2 },{
            _id:0,
            active:0,
            profile_status:0,
            password:0 ,
            deleted:0,
            __v:0           
        },{deleted: false,}).sort({ createdAt: -1 }) //role 2 cleaner
        let data = JSON.parse(JSON.stringify(list));
   
        const csvStream = csv.format({ headers: true });

        csvStream.pipe(writerStream).on("end", data => console.log("end",data))
        .on("finish", data => 
            res.download(paths)
          )
          .on("error", error => 
            console.log("error",error)
          );
        data.map((res)=>{
            csvStream.write(res);
         })
        csvStream.end();
          if (!data) {
            throw new Error("Server error occured");
          }
          return res.status(200).send({
            status: true,
            status_code: 200,
            // data,
            message: " cleaner csv  fetch successfully",
          });
        return Promise.resolve(paths)
    } catch (error) {
        return res.status(200).send({
            status: false,
            status_code: 400,
            error,
            message: error.message ? error.message : "Error while export cleaner csv ",
        });
    }
};


// exports.exportCsvServiceRequest = async (req, res) => {
//     try {
//         let populateQuery = [
//             { path: "customerId" },
//             { path: "acceptedBy" },
//             { path: "serviceType" },
//             { path: "servicePackage" },
//           ];
//         let paths = path.join(__dirname,'../../csv')
//         let filename = Date.now() + "service-request.csv";
//         paths = paths + "/" + filename;
//         var writerStream = fs.createWriteStream(paths);
//         let list = await ServiceRequest.find({
//             deleted: false,
//             // rejectedBy: { $nin: [userid] },
//           })
//             .sort({
//               createdAt: -1,
//             })
//             .populate(populateQuery)
//         let data = JSON.parse(JSON.stringify(list));
//         const csvStream = csv.format({ headers: true });
//         csvStream.pipe(writerStream).on('end', (data) =>process.exit());
//         var source={}
//         data.map((res)=>{
//             source = res;
//          })
//         var array = [] ;
//         let customer=source.customerId;
//         let acceptedBy=source.acceptedBy;
//         let serviceType=source.serviceType;
//         let servicePackage=source.servicePackage;
//         array.push(customer)
//         array.push(acceptedBy)
//         array.push(serviceType)
//         array.push(servicePackage)
//         array.map((res)=>{
//             csvStream.write(res);
//          })
//         // csvStream.end();
//         //   if (!data) {
//         //     throw new Error("Server error occured");
//         //   }
//         //   return res.status(200).send({
//         //     status: true,
//         //     status_code: 200,
//         //     data,
//         //     message: " cleaner csv  fetch successfully",
//         //   });
//     } catch (error) {
//         return res.status(200).send({
//             status: false,
//             status_code: 400,
//             error,
//             message: error.message ? error.message : "Error while export cleaner csv ",
//         });
//     }
// };

