using System;
using System.ComponentModel.DataAnnotations;

namespace Debug_Evaluation.Model
{
    public class SettingEvalModel
    {
        [Required]
        public string AppId {get;set;}
        [Required]
        public string Setting {get;set;}
        [Required]
        public string Value {get;set;}
        //public DateTime Evaluationtime {get;set;}
        public RandomizationUnit RandomizationUnit {get;set;}
        public Tuple[] Constraint {get;set;}
        public Tuple[] Context {get;set;}

        public bool HasVerboseLog
        {
            get 
            {
                if(this.RandomizationUnit != null && this.Constraint != null && this.Context != null)
                {
                    return true;
                }
                return false;
            }
        }
    }

    public class Tuple
    {
        public string Key {get; set;}
        public string Value {get; set;}
    }

    public class RandomizationUnit
    {
        public string Type {get; set;}
        public string Id {get; set;}
        public string Name {get; set;}
    }
}