import java.util.Random;

public class Maker {

    public Maker() {
        fillArray();

    }
    public void fillArray() {
        System.out.print("[");
        for (int i = -25; i < 25; i++) {
            System.out.print("[");
            
            for (int j = -25; j < 25; j++) {

                if (i < 0) {
                    System.out.print(0 + ", ");
    
                } else {
                    Random rand = new Random();
                    int val = rand.nextInt(1, 5);
                    System.out.print(val + ", ");
                }
                
            }
            

            System.out.print("],\n");
        }
        System.out.print("];");
    }
}


