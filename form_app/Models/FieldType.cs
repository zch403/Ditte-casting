namespace NameApp.Api.Models
{
    public enum FieldType
    {
        Text,
        Number,
        Date,
        Bool,
        Email,
        PhoneNumber
    }
    public static class FormFieldTypeHelper
    {
        public static FieldType? FromString(string typeStr)
        {
            return typeStr.ToLower() switch
            {
                "text" => FieldType.Text,
                "number" => FieldType.Number,
                "boolean" => FieldType.Bool,
                "date" => FieldType.Date,
                "email" => FieldType.Email,
                "phonenumber" => FieldType.PhoneNumber,
                _ => null
            };
        }
    }
}