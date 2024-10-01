import mongoose from "mongoose";
import moment from "moment"; 

const taskSchema = new mongoose.Schema({
  adminUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  assignedUser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true

  },

  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["to-do", "in progress", "completed"],
    default: "to-do",
  },

  priority:{
    type:String,
    enum:["low", "medium", "high"],
    default:"medium"

  },

  dueDate: {
    type: Date,
    validate: {
      validator: function (value) {
        // Validate that the dueDate is in the future (including today)
        return moment(value).isSameOrAfter(moment().startOf("day"));
      },
      message: "Due date must be a future date.",
    },
  },
 
},{timestamps:true});


const taskModel = mongoose.model("Task", taskSchema);
export default taskModel;
