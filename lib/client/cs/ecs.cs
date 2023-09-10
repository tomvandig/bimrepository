
using bimrepo;
using System.Security.Cryptography;
using System;

// From: https://github.com/buildingsmart-private/IfcDoc/blob/master/IfcKit/utilities/BuildingSmart.Utilities.Conversion/GlobalIdConverter.cs
class GuidParser
{
    public static Guid Parse(string format64)
    {
        int i, j, m;
        uint[] num = new uint[6];

        if (format64 == null)
        {
            return Guid.Empty;
        }

        if (format64.Contains("-"))
        {
            return new Guid(format64);
        }

        format64 = format64.Trim('\'');

        if (format64.Length != 22)
        {
            throw new ArgumentException("Invalid Global ID Length: " + format64);
        }

        j = 0;
        m = 2;

        for (i = 0; i < 6; i++)
        {
            string temp = format64.Substring(j, m);
            j = j + m;
            m = 4;

            num[i] = cv_from_64(temp);
        }

        uint Data1 = (uint)(num[0] * 16777216 + num[1]);                 // 16-13. bytes
        ushort Data2 = (ushort)(num[2] / 256);                              // 12-11. bytes
        ushort Data3 = (ushort)((num[2] % 256) * 256 + num[3] / 65536);     // 10-09. bytes

        byte Data4_0 = (byte)((num[3] / 256) % 256);                   //    08. byte
        byte Data4_1 = (byte)(num[3] % 256);                           //    07. byte
        byte Data4_2 = (byte)(num[4] / 65536);                         //    06. byte
        byte Data4_3 = (byte)((num[4] / 256) % 256);                   //    05. byte
        byte Data4_4 = (byte)(num[4] % 256);                           //    04. byte
        byte Data4_5 = (byte)(num[5] / 65536);                         //    03. byte
        byte Data4_6 = (byte)((num[5] / 256) % 256);                   //    02. byte
        byte Data4_7 = (byte)(num[5] % 256);                           //    01. byte

        return new Guid(Data1, Data2, Data3, Data4_0, Data4_1, Data4_2, Data4_3, Data4_4, Data4_5, Data4_6, Data4_7);
    }
    
    private static string cConversionTable = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$";
//
    // The reverse function to calculate the number from the code
    //
    private static uint cv_from_64(string str)
    {
        int len, i, j, index;

        len = str.Length;
        if (len > 4)
        {
            throw new ArgumentException("Invalid Global ID Format");
        }

        uint pRes = 0;

        for (i = 0; i < len; i++)
        {
            index = -1;
            for (j = 0; j < 64; j++)
            {
                if (cConversionTable[j] == str[i])
                {
                    index = j;
                    break;
                }
            }

            if (index == -1)
            {
                throw new ArgumentException("Invalid Global ID Format");
            }

            pRes = (uint)(pRes * 64 + index);
        }

        return pRes;
    }
}


public class Reference<T>
{
    public UUID4 entity;
    public string typeHash;
    public UInt16 componentID;

    public Reference(UUID4 entity, string typeHash, UInt16 componentID)
    {
        this.entity = entity;
        this.componentID = componentID;
        this.typeHash = typeHash;
    }

    public static Reference<T> From<T>(T component) where T : ECSComponent
    {
        return new Reference<T>(component.getEntityID(), component.getTypeHash(), 0);
    }
}

public class UUID4
{
    public byte[] bytes;

    public UUID4()
    {
        bytes = new byte[16];

        // TODO: slow
        RNGCryptoServiceProvider rng = new RNGCryptoServiceProvider();
        rng.GetBytes(bytes);
    }

    public static UUID4 FromIfcGuid(string ifcGuid)
    {
        return FromGuid(GuidParser.Parse(ifcGuid));
    }

    public static UUID4 FromGuid(Guid guid)
    {
        var id = new UUID4();
        id.bytes = guid.ToByteArray();
        return id;
    }

    public static UUID4 FromFB(uuidv4T uuid)
    {
        var id = new UUID4();
        id.bytes = uuid.Values;
        return id;
    }

    public bool Equals(UUID4 other)
    {
        return this.bytes.Equals(other.bytes);
    }
}
public class ECSComponent {

    private string simplifiedName;
    private string typeHash;
    private UUID4 entityID;

    public ECSComponent(string name, string typeHash, UUID4 entityID)
    {
        this.simplifiedName = name;
        this.entityID = entityID;
        this.typeHash = typeHash;
    }

    public string getSimplifiedName()
    {
        return this.simplifiedName;
    }

    public string getTypeHash()
    {
        return this.typeHash;
    }

    public virtual ComponentT exportToDataArray(ComponentIdentifierT id)
    {
        return new ComponentT();
    }

    public virtual SchemaT exportDefinitionToArray() {
        return new SchemaT();
    }
    public UUID4 getEntityID()
    {
        return this.entityID;
    }
}

