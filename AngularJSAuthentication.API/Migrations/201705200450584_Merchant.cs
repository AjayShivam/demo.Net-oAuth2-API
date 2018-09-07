namespace AngularJSAuthentication.API.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Merchant : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Merchants",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(nullable: false),
                        FirmName = c.String(),
                        DateRegistration = c.DateTime(nullable: false),
                        ContactNumber = c.String(nullable: false),
                        Description = c.String(),
                        Address = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Merchants");
        }
    }
}
