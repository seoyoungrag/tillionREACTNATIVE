using ReactNative.Bridge;
using System;
using System.Collections.Generic;
using Windows.ApplicationModel.Core;
using Windows.UI.Core;

namespace Ad.Brix.RNAdBrix
{
    /// <summary>
    /// A module that allows JS to share data.
    /// </summary>
    class RNAdBrixModule : NativeModuleBase
    {
        /// <summary>
        /// Instantiates the <see cref="RNAdBrixModule"/>.
        /// </summary>
        internal RNAdBrixModule()
        {

        }

        /// <summary>
        /// The name of the native module.
        /// </summary>
        public override string Name
        {
            get
            {
                return "RNAdBrix";
            }
        }
    }
}
