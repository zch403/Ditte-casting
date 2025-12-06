namespace NameApp.Api.Models
{
    public enum ConditionOperator
    {
        Equals,
        NotEquals,
        Greater,
        Less
    }
    public static class ConditionOperatorHelper
    {
        public static ConditionOperator? FromString(string typeStr)
        {
            return typeStr.ToLower() switch
            {
                "equals" => ConditionOperator.Equals,
                "not_equals" => ConditionOperator.NotEquals,
                "greater" => ConditionOperator.Greater,
                "less" => ConditionOperator.Less,
                _ => null
            };
        }
    }
}